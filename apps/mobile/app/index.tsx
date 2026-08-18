import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card className="m-3 max-w-[360px] rounded-lg p-5">
        <Heading size="md" className="mb-2">
          DB SDK
        </Heading>
        <Text className="text-sm text-typography-700">
          Provider-agnostic TypeScript SDK for safely reading databases.
        </Text>
      </Card>
    </View>
  );
}
