import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Dimensions, Keyboard, Vibration, Button, TouchableOpacity, Animated,
} from "react-native";
import { Box, Fab } from "native-base";
import { useIsFocused } from "@react-navigation/native";
import { runOnJS } from "react-native-reanimated";

import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import ScannerOverlay from "../scanner-list/ScannerOverlay";
import { BarcodeFormat, useScanBarcodes, scanBarcodes } from "vision-camera-code-scanner";
import TextField from "../../components/textField";


import {
  getTagCowCard,
  getTagsCheck,
  getCowCardScanner,
  getCowCard,
} from "../../models/cow-card/api";
import { setNotification } from "../../models/notification/action";
import { getCowCardWeighing } from "../../models/cowCard-weight/api";
import { setNotebookList } from "../../models/cow-card/action";
import { useSharedValue } from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";

const mstp = state => {
  return {
    cowCardScanner: state.cowCardScanner,
    auth: state.auth,
    cowCard: state.cowCard,
    cowCardWeighing: state.cowCardWeighing,
    profile: state.profile,
    notebook: state.notebook,
    tagCowCard: state.tagCowCard,
    tagsCheck: state.tagsCheck,
  };
};

const mdtp = dispatch => {
  return {
    setNotification: data => dispatch(setNotification(data)),
    getCowCardScanner: data => dispatch(getCowCardScanner(data)),
    getCowCard: data => dispatch(getCowCard(data)),
    getCowCardWeighing: data => dispatch(getCowCardWeighing(data)),
    setNotebookList: data => dispatch(setNotebookList(data)),
    getTagCowCard: data => dispatch(getTagCowCard(data)),
    getTagsCheck: data => dispatch(getTagsCheck(data)),
  };
};

const FadeInView = ({ zoomLevel, setZoomLevel, flashState, setFlashState, panelAction }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []); // Второй аргумент пустой массив зависимостей


  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateX: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [panelAction ? 40 : 15, panelAction ? 15 : 40],
            }),
          },
        ],
      }}>
      <Box style={{ flexDirection: "row", position: "absolute", bottom: 0, right: "15%" }}>
        <TouchableOpacity onPress={() => zoomLevel !== 10 && setZoomLevel(zoomLevel + 1)}>
          <Box style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            backgroundColor: "rgb(83,171,219)",
            borderRadius: 50,
            marginBottom: 20,
            marginRight: 20,
            color: "white",
          }}> <Ionicons
            style={{ color: "#ffffff" }}
            name={"add-outline"}
            size={25}
          /></Box>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => zoomLevel !== 1 && setZoomLevel(zoomLevel - 1)}>
          <Box style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            backgroundColor: "rgb(83,171,219)",
            marginBottom: 20,
            borderRadius: 50,
            marginRight: 20,
            color: "white",
          }}> <Ionicons
            style={{ color: "#ffffff" }}
            name={"remove-outline"}
            size={25}
          /></Box>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => flashState === "on" ? setFlashState("off") : setFlashState("on")}>
          <Box style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            backgroundColor: "rgb(83,171,219)",
            borderRadius: 50,
            marginRight: 20,
            color: "white",
          }}> <Ionicons
            style={{ color: "#ffffff" }}
            name={"flashlight-outline"}
            size={25}
          /></Box>
        </TouchableOpacity>
      </Box>
    </Animated.View>
  );
};
const ShowPanelAction = ({ setPanelAction, panelAction }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const rotateValue = panelAction ? 180 : 0;

  const rotateButton = () => {
    Animated.timing(rotateAnim, {
      toValue: rotateValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setPanelAction(!panelAction);
  };

  return (
    <TouchableOpacity onPress={rotateButton} style={{
      position: "absolute",
      bottom: 0,
      right: 10,
    }}>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 50,
          backgroundColor: "rgb(83,171,219)",
          borderRadius: 50,
          marginBottom: 20,
        }}>
        <Animated.View
          style={{
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 180],
                outputRange: ["0deg", "180deg"],
              }),
            }],
          }}>
          <Ionicons
            style={{ color: "#ffffff" }}
            name={"chevron-back-outline"}
            size={25}
          />
        </Animated.View>
      </Box>
    </TouchableOpacity>
  );
};


function QrScanned(props) {

  const [hasPermission, setHasPermission] = useState(false);
  const [infoCard, setInfoCard] = useState(false);
  const [panelAction, setPanelAction] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [flashState, setFlashState] = useState("off");
  const [isActiveScanner, setIsActiveScanner] = useState(true);

  const { navigation } = props;


  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);


  const onQRCodeDetected = async (qrCode) => {
    const { notebook } = props;
    const checkNote = notebook.filter(item => item.rfid == qrCode);

    if (checkNote.length === 0) {
      Vibration.vibrate(10000);
      onSuccess(qrCode);
      setInfoCard(true);
    } else {
      const { setNotification } = props;
      Vibration.vibrate(10000);
      setNotification({
        isActive: true,
        info: {
          title: `Метка ${qrCode} уже добавлена`,
          status: "warning",
          placement: "top",
        },
      });
    }
    setIsActiveScanner(false);
    setTimeout(() => {
      setIsActiveScanner(true);
    }, 3000);
  };


  const onSuccess = (mark) => {
    const {
      getTagsCheck,
      navigation,
      setNotification,
      cowCardScanner,
      profile,
      setNotebookList,
    } = props;

    if (profile.version === 1) {
      const dataMark = {
        id: Math.random(1, 999),
        rfid: mark,
        comment: "",
      };
      setNotebookList(dataMark);
      Keyboard.dismiss();
      setNotification({
        isActive: true,
        info: {
          title: `Метка ${mark} добавлена в Реестр`,
          status: "success",
          placement: "top",
        },
      });
    } else {
      getTagsCheck({ mark: mark }).then(async () => {
        const { tagsCheck } = props;
        if (tagsCheck.checkMark) {
          const { profile } = props;

          if (profile.version === 0) {
            const { getTagCowCard } = props;
            await getTagCowCard({ mark: mark })
              .then(() => {
                const { tagCowCard, cowCardWeighing } = props;
                console.log("tagCowCard.data: ", tagCowCard.data);
                console.log("-------------------------------------------------------------");
              });
          } else {
            const { setNotebookList } = props;
            const data = { id: Math.random(1, 999), rfid: mark, comment: "" };
            setNotebookList(data);
            Keyboard.dismiss();
            setNotification({
              isActive: true,
              info: {
                title: `Метка ${mark} добавлена в Реестр`,
                status: "success",
                placement: "top",
              },
            });
          }
        } else {
          const { setNotification } = props;
          Keyboard.dismiss();
          setNotification({
            isActive: true,
            info: {
              title: `Метка ${mark} не найдена в базе`,
              status: "warning",
              placement: "top",
            },
          });
        }
      });
    }
  };

  const devices = useCameraDevices();

  const device = devices.back;

  const qrBounds = useSharedValue({ top: 0, left: 0, right: 0, bottom: 0 });

  const frameProcessor = useFrameProcessor(
    frame => {
      "worklet";
      const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128], { checkInverted: true });
      if (isActiveScanner && detectedBarcodes[0]?.rawValue !== undefined) {
        runOnJS(onQRCodeDetected)(detectedBarcodes[0]?.rawValue);
      }
    }, [onQRCodeDetected],
  );


  const isFocused = useIsFocused();


  return (
    device != null &&
    hasPermission && (
      <View flex={1}>
        <Camera
          style={[StyleSheet.absoluteFill]}
          device={device}
          isActive={isFocused}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
          zoom={zoomLevel}
          torch={flashState}
        />
        <ScannerOverlay />
        <ShowPanelAction setPanelAction={setPanelAction} panelAction={panelAction} />
        {panelAction && <FadeInView zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} flashState={flashState}
                                    setFlashState={setFlashState} panelAction={panelAction} />}
      </View>
    ));
}

export default connect(mstp, mdtp)(QrScanned);

