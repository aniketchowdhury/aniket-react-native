import { useState } from "react";
import React, { useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
  Button,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";

export const Photos = ({ navigation, route }) => {
  const [imageList, setImageList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectImg, setSelectImg] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    const getData = async () => {
      const imgResponse = await fetch(`https://picsum.photos/v2/list`);
      const imgData = await imgResponse.json();
      setImageList(imgData);
    };
    getData();
  }, []);
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* <Image /> */}
        <Text style={{ color: "white" }}>
          Photos page {route.params.description}
        </Text>
        {imageList?.map((data, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectImg(data?.download_url);
              }}
            >
              <Image
                source={{ uri: data?.download_url }}
                style={{ width: 100, height: 100 }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View>
        <Modal
          animationType="slide"
          // statusBarTranslucent={true}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <Button
            title="Close"
            onPress={() => setModalVisible(!modalVisible)}
          ></Button>
          <Image source={{ uri: selectImg }} style={styles.img} />
        </Modal>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    // height: "100%",
    // gap: "20px", /* doesnt work in R-Native*/
  },
  img: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
