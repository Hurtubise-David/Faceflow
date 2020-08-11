// Copyright 1998-2018 Epic Games, Inc. All Rights Reserved.
#include "FaceflowLiveSourceFactory.h"
#include "FaceflowLiveSource.h"
#include "SFaceflowLiveSourceFactory.h"

#define LOCTEXT_NAMESPACE "FaceflowLiveSourceFactory"

FText UFaceflowLiveSourceFactory::GetSourceDisplayName() const
{
	return LOCTEXT("SourceDisplayName", "FACEFLOW LiveLink");
}

FText UFaceflowLiveSourceFactory::GetSourceTooltip() const
{
	return LOCTEXT("SourceTooltip", "Creates a connection to FACEFLOW UDP Stream");
}

TSharedPtr<SWidget> UFaceflowLiveSourceFactory::BuildCreationPanel(FOnLiveLinkSourceCreated InOnLiveLinkSourceCreated) const
{
	return SNew(SFaceflowLiveSourceFactory)
		.OnOkClicked(SFaceflowLiveSourceFactory::FOnOkClicked::CreateUObject(this, &UFaceflowLiveSourceFactory::OnOkClicked, InOnLiveLinkSourceCreated));
}

TSharedPtr<ILiveLinkSource> UFaceflowLiveSourceFactory::CreateSource(const FString& InConnectionString) const
{
	FIPv4Endpoint DeviceEndPoint;
	if (!FIPv4Endpoint::Parse(InConnectionString, DeviceEndPoint))
	{
		return TSharedPtr<ILiveLinkSource>();
	}

	return MakeShared<FFaceflowLiveSource>(DeviceEndPoint);
}

void UFaceflowLiveSourceFactory::OnOkClicked(FIPv4Endpoint InEndpoint, FOnLiveLinkSourceCreated InOnLiveLinkSourceCreated) const
{
	InOnLiveLinkSourceCreated.ExecuteIfBound(MakeShared<FFaceflowLiveSource>(InEndpoint), InEndpoint.ToString());
}

#undef LOCTEXT_NAMESPACE