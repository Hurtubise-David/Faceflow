// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "Kismet/BlueprintFunctionLibrary.h"
#include "Json_PluginBPLibrary.generated.h"

/* 

*/

typedef TSharedPtr<FJsonObject> JsonObjectPtr;
typedef TSharedPtr<FJsonValue> JsonValuePtr;
typedef FString FullPath;

UCLASS()
class UJson_PluginBPLibrary : public UBlueprintFunctionLibrary
{
	GENERATED_UCLASS_BODY()

	UFUNCTION(Blueprintcallable, Category = "Json Utilities")
	static bool WriteJsonFile(FString FileName, FString Server, TArray<FString> ServerItems, TArray<int> ItemValue);

	UFUNCTION(BlueprintCallable, Category = "Json Utilities")
	static bool ReadJsonFile(FString FileName, FString &Server, TArray<FString> &ServerItems, TArray<int> &ItemValue);

};
