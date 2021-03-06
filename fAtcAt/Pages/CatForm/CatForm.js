import React, { useState } from "react";
import Form from "../../components/Form/Form";
import { socket } from "./../../Services/Socket/Socket";
import { StyleSheet, View, Alert } from "react-native";
import {
  hoursOptions,
  sexOptions,
} from "../../components/Form/constantOptions";
import {
  validateContent,
  validateLength,
} from "../../components/Form/validation";

const CatForm = ({
  bowls,
  on_button_submit,
  editTarget,
  get_current_weight,
}) => {
  const [scaleBowlName, setBowlName] = useState();
  const afterSubmitMessage = (result) => {
    if (result) {
      Alert.alert("New Cat! Yipi Ya");
    } else {
      Alert.alert("Oops... a problem");
    }
  };

  socket.once("current_weight_response", (data) => {
    console.log("current_weight_response data = ", data);
    try {
      Alert.alert(
        `Response from ${scaleBowlName}`,
        `Current weight is = ${data["message"]}`
      );
    } catch (err) {
      console.warn("-W- current_weight_response ", err);
    }
  });

  const get_weight = () => {
    //function to make three option alert

    Alert.alert(
      //title
      "Scale cat",
      //body
      "Choose bowl",
      bowls.map((bowl) => {
        return {
          text: bowl.name,
          onPress: async () => {
            try {
              setBowlName(bowl.name);
              const w = await get_current_weight(bowl.bowlID);
              // console.log("-D- get_current_weight returned ", w);
            } catch (err) {
              console.warn(err);
              Alert.alert(
                "SORRY =[",
                "Couldn't get weight from bowl - " + bowl.name
              );
            }
          },
        };
      }),
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Form
        objectType="cat"
        fields={{
          name: {
            label: "Name",
            validators: [validateContent],
            type: "text",
          },
          sex: {
            label: "Sex",
            type: "picker",
            options: sexOptions,
          },
          weight: {
            label: "Weight",
            type: "slider",
            options: [0.5, 21.3],
          },
          scale: {
            type: "button",
            options: () => {
              get_weight();
            },
          },
          bowlID: {
            label: "Bowl",
            type: "picker",
            options: bowls.map((bowl) => {
              return { value: bowl.bowlID, label: bowl.name };
            }),
          },
          feedingHours: {
            label: "Feeding Hours",
            type: "timeRange",
            options: hoursOptions,
          },
        }}
        buttonText="Submit"
        action={on_button_submit}
        afterSubmit={afterSubmitMessage}
        editTarget={editTarget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#C8EEB2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default CatForm;
