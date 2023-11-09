import { useNavigation } from "@react-navigation/native";
import { Button, TouchableOpacity } from "react-native";

export const BackButton = () => {
  const nav = useNavigation();
  return (
    <TouchableOpacity>
      <Button title="<--" onPress={() => nav.goBack()} />
    </TouchableOpacity>
  );
};
