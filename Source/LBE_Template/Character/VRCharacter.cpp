// Fill out your copyright notice in the Description page of Project Settings.


#include "VRCharacter.h"
#include "camera/CameraComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/PostProcessComponent.h"
#include "Materials/MaterialInstanceDynamic.h"

// Sets default values
AVRCharacter::AVRCharacter()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	VRRoot = CreateDefaultSubobject<USceneComponent>(TEXT("VRRoot"));
	VRRoot->SetupAttachment(GetRootComponent());
	
	Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
	Camera->SetupAttachment(VRRoot);

	DestinationMarker = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("DestinationMarker"));
	DestinationMarker->SetupAttachment(VRRoot);

	VRPostProcessComponent = CreateDefaultSubobject<UPostProcessComponent>(TEXT("VRPostProcessComponent"));
	VRPostProcessComponent->SetupAttachment(VRRoot);

}

// Called when the game starts or when spawned
void AVRCharacter::BeginPlay()
{
	Super::BeginPlay();

	if (Post_Process_mat != nullptr)
	{
		VRPostProcessMaterialInstance = UMaterialInstanceDynamic::Create(Post_Process_mat, this);
		VRPostProcessComponent->AddOrUpdateBlendable(VRPostProcessMaterialInstance);

		VRPostProcessMaterialInstance->SetScalarParameterValue(TEXT("Radius"), 0.2);
	}
}

// Called every frame
void AVRCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FVector NewCameraOffset = Camera->GetComponentLocation() - GetActorLocation();
	NewCameraOffset.Z = 0;
	//FVector::VectorPlaneProject();
	AddActorWorldOffset(NewCameraOffset);
	VRRoot->AddWorldOffset(-NewCameraOffset);

	UpdateDestinationMarker();
	UpdateBlink();

}

// Called to bind functionality to input
void AVRCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	PlayerInputComponent->BindAxis(TEXT("Forward"), this, &AVRCharacter::MoveForward);
	PlayerInputComponent->BindAxis(TEXT("Right"), this, &AVRCharacter::MoveRight);
}

void AVRCharacter::MoveForward(float Throttle)
{
	AddMovementInput(Throttle* Camera->GetForwardVector());
}

void AVRCharacter::MoveRight(float Throttle)
{
	AddMovementInput(Throttle* Camera->GetRightVector());
}

void AVRCharacter::UpdateDestinationMarker()
{
	FVector Start = Camera->GetComponentLocation();
	FVector End = Start + Camera->GetForwardVector()* MaxTeleportDistance;
	FHitResult HitResult;
	
	bool bHit = GetWorld()->LineTraceSingleByChannel(HitResult, Start, End, ECC_Visibility);
	DestinationMarker->SetCollisionProfileName(TEXT("NoCollision"));


	if (bHit)
	{
		DestinationMarker->SetWorldLocation(HitResult.Location);
		DestinationMarker->SetVisibility(true);

	}
	else
	{
		DestinationMarker->SetVisibility(false);
	}
}

void AVRCharacter::UpdateBlink()
{
	float Speed = GetVelocity().Size();
	float Radius = RadiusVsVelocity->GetFloatValue(Speed);

	VRPostProcessMaterialInstance->SetScalarParameterValue(TEXT("Radius"), Radius);

	FVector2D Center = ImageCenter();
	VRPostProcessMaterialInstance->SetVectorParameterValue(TEXT("Center"), FLinearColor(Center.X, Center.Y, 0));
	
}

FVector2D AVRCharacter::ImageCenter()
{
	FVector MovementDirection = GetVelocity().GetSafeNormal();
	if (MovementDirection.IsNearlyZero())
	{
		return FVector2D(0.5, 0.5);
	}

	FVector WorldStationaryLocation = Camera->GetComponentLocation() + MovementDirection * 100;

	return FVector2D(0.2, 0.2);
}

