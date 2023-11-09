import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Alert,
  DrawerLayoutAndroid,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Photos } from "./src/components/Photos";
// import { AuthContext } from "./src/context/AuthContext";
// import { AxiosContext } from "./src/context/AxiosContext";
import * as SecureStore from "expo-secure-store";
import { FlatList } from "react-native-gesture-handler";
import { BackButton } from "./src/components/BackButton";
import { Options } from "./src/components/Options";
import { useRef } from "react";
function DetailsScreen({ navigation, route }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const drawer = useRef(null);
  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Text style={styles.paragraph}>I'm in the Drawer!</Text>
      <Button
        title="Close drawer"
        onPress={() => drawer.current.closeDrawer()}
      />
    </View>
  );
  return (
    <DrawerLayoutAndroid
      // style={styles.container}
      ref={drawer}
      drawerWidth={300}
      // drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Details Screen {route.params.name}</Text>
        <Button
          title="|||"
          onPress={() => {
            drawer.current.openDrawer();
          }}
        />
      </View>
    </DrawerLayoutAndroid>
  );
}
function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [jwt, setJWT] = useState(null);
  const [details, setDetails] = useState([]);
  const [dummyData, setDummyData] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUserName] = useState("");
  const [userpassword, setUserPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  // const [openDrawer, setOpenDrawer] = useState(false);
  const drawer = useRef(null);
  /* start of copied auth code*/
  // const authContext = useContext(AuthContext);
  // const { publicAxios } = useContext(AxiosContext);

  const onLogin = async () => {
    try {
      const response = await fetch(
        "https://a985-27-7-141-8.ngrok-free.app/jwt/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username,
            password: userpassword,
          }),
        }
      );
      if (response.ok) {
        const dd = await response.json();
        setLoginStatus(true);
        const { refreshToken } = dd;
        setJWT(refreshToken);
        // authContext.setAuthState({
        //   // accessToken,
        //   refreshToken,
        //   authenticated: true,
        // });

        await SecureStore.setItemAsync("token", refreshToken);
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("Login Failed");
    }
  };
  /* end of copied auth code*/
  useEffect(() => {
    const getData = async () => {
      try {
        const jwt11 = await SecureStore.getItemAsync("token");
        console.log("***keychain jwt", jwt11);
        if (!jwt11) throw "no jwt";
        // const jwt11 = JSON.parse(value.password);
        const rrr = await fetch(
          `https://a985-27-7-141-8.ngrok-free.app/jwt/details/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${jwt11}`, // notice the Bearer before your token
            },
          }
        );
        if (rrr.ok) {
          const data1 = await rrr.json();
          setLoginStatus(true);
          console.log("***details:-", data1.calorie_intake);
          setDetails(data1?.calorie_intake);
        }
        const res1 = await fetch(
          "https://a985-27-7-141-8.ngrok-free.app/data/"
        );
        if (res1.ok) {
          const dummydata = await res1.json();
          console.log("***dummy data", dummydata[0]);
          setDummyData(dummydata[0].email ?? "Aniket@Chowdhury");
          setDescription(dummydata[0].username ?? "Aniket Chowdhury");
        }
      } catch (err) {
        console.log("***error: inuseeffect:::" + err);
        Alert.alert("Error in usefeect");
      }
    };
    getData();
  }, [loginStatus, jwt]);

  const handleLogout = async () => {
    try {
      const jwt11 = await SecureStore.getItemAsync("token");
      console.log("***keychain jwt LOGOUT", jwt11);
      // const jwt11 = JSON.parse(value.password);
      const res = await fetch(
        `https://a985-27-7-141-8.ngrok-free.app/jwt/logout`,
        {
          method: "GET",
          // withCredentials: true,
          // credentials: "include", // added this part
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt11}`,
          },
        }
      );
      if (res.ok) {
        await SecureStore.deleteItemAsync("token").then(() => {
          setLoginStatus(false);
          setJWT(null);
          setDetails([]);
          setUserName("");
          setUserPassword("");
          setDummyData("");
          setDescription("");
        });
        // await Keychain.resetGenericPassword();
      }
    } catch (err) {
      Alert.alert("Logout Error");
    }
  };
  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Text style={styles.paragraph}>I'm in the Drawer!</Text>
      <Button
        title="Close drawer"
        onPress={() => drawer.current.closeDrawer()}
      />
    </View>
  );
  return (
    // <SafeAreaView style={styles.container}>
    <DrawerLayoutAndroid
      style={styles.container}
      ref={drawer}
      drawerWidth={200}
      // drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={styles.header}>
        <Button
          title="|||"
          onPress={() => {
            drawer.current.openDrawer();
          }}
        />
      </View>
      <Text>Home Screen</Text>
      <Text style={styles.text}>
        {`Open up App.js to start working on your app Mr.${dummyData}!`}
      </Text>
      {details && details.length > 0 && (
        <View style={styles.viewStyle}>
          <FlatList
            data={details}
            renderItem={({ item, index }) => (
              <Text style={styles.text}>
                {item?.calorie_value}------{item?._id}
              </Text>
            )}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{ columnGap: 14 }}
          />
        </View>
      )}
      {!loginStatus && (
        <TextInput
          placeholder="Enter username"
          style={styles.textInput}
          onChangeText={setUserName}
          value={username}
        />
      )}
      {!loginStatus && (
        <TextInput
          placeholder="Enter password"
          style={styles.textInput}
          onChangeText={setUserPassword}
          value={userpassword}
          secureTextEntry={true}
        />
      )}
      <Button
        title={loginStatus ? `Logout` : `Login`}
        onPress={() => {
          loginStatus ? handleLogout() : onLogin(); // handleLogin();
        }}
      />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details", { name: dummyData })}
      />
      <Button
        title="Go to Photos"
        onPress={() =>
          navigation.navigate("Photos", { description: description })
        }
      />
      <StatusBar style="auto" />
      {/* </SafeAreaView> */}
    </DrawerLayoutAndroid>
  );
}
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options={{
          //   headerStyle: { backgroundColor: "#E5E5E5" },
          //   headerShadowVisible: false,
          //   headerLeft: () => <Options />,
          //   headerTitle: "",
          // }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="Photos"
          component={Photos}
          options={{
            headerStyle: { backgroundColor: "#E5E5E5" },
            headerShadowVisible: false,
            headerLeft: () => <BackButton />,
            headerTitle: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
  },
  navigationContainer: { backgroundColor: "#ecf0f1" },
  container: {
    display: "flex",
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    // gap: "20px", /* doesnt work in R-Native*/
  },
  text: {
    color: "red",
  },
  viewStyle: {
    width: "100%",
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    padding: 5,
    height: 40,
    width: 160,
    backgroundColor: "#fff",
  },
});
