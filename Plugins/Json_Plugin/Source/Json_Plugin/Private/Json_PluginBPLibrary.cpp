// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

#include "Json_PluginBPLibrary.h"
#include "JsonUtilities/Public/JsonUtilities.h"
#include "Serialization/JsonReader.h"
#include "Json_Plugin.h"

static const FString RootName("inventoryObject");

UJson_PluginBPLibrary::UJson_PluginBPLibrary(const FObjectInitializer& ObjectInitializer)
: Super(ObjectInitializer)
{

}


bool UJson_PluginBPLibrary::ReadJsonFile(FString FileName, FString &Server, TArray<FString> &ServerItems, TArray<int> &ItemValue)
{
	FString RawData;
	FString Path;
	Path = FPaths::ProjectDir() / "Tensorflow/facemesh/src";
	Path += "/";
	Path += FileName;

	bool bloadedfile = FFileHelper::LoadFileToString(RawData, *Path);

	if (bloadedfile)
		{
			JsonObjectPtr JsonMainObject = MakeShareable(new FJsonObject());
			TSharedRef<TJsonReader<>> JsonReader = TJsonReaderFactory<>::Create(RawData);

			if (FJsonSerializer::Deserialize(JsonReader, JsonMainObject))
			{
					Server = JsonMainObject->GetStringField("MESH_ANNOTATIONS");
					
					for (JsonValuePtr V : JsonMainObject->GetArrayField("lipsUpperOuter"))
					{
						ServerItems.Add(V->AsString());
					}

					//for (JsonValuePtr V : JsonMainObject->GetArrayField("Mode"))
					//{
					//	ItemValue.Add(V->AsNumber());
					//}
			return true;
			}
		}
	return false;
}
