import React from 'react';
import { TouchableOpacity, Image, StyleSheet, StatusBar, Dimensions, View, Alert, ScrollView } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { Camera } from 'expo-camera';
import { withNavigation } from '@react-navigation/compat';

import { Images, nowTheme } from '../../constants';
import Actions from '../../lib/actions';
import UserService from '../../services/user';

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

class DocumentosStep4Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorUploading: false,
      userData: null,

      hasPermissionCamera: null,
      cameraType: Camera.Constants.Type.back,
      openCamera: false,
      file1: this.props.route.params.fileINE,
      file2: this.props.route.params.fileRFC,
      file3: this.props.route.params.fileCLABE,
      file4: null
    };
  }

  async componentDidMount() {
    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user });
      }
    });

    const { status } = await Camera.requestCameraPermissionsAsync()
    this.setState({ hasPermissionCamera: status === 'granted' });
  }

  handleCameraPhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({ quality: 1, base64: true });

      Alert.alert("Foto de perfil", "¿Desea volver a tomar otra fotografía o continuar?", [
        {
          text: 'Volver a tomar',
          onPress: () => this.setState({ openCamera: false }),
          style: 'cancel'
        },
        {
          text: 'Continuar', onPress: async () => {
            this.setState({ isLoading: true, openCamera: false });
            let hasError = false;

            // INE UPLOAD
            let file1 = {
              user_id: this.state.userData.id,
              name: "INE",
              document: `data:image/jpg;base64,${this.state.file1.base64}`,
              isBase64: true
            }

            await UserService.storeDocuments(file1)
              .then(response => console.log(response.message))
              .catch(e => {
                Alert.alert("INE", "Hubo un problema al subir tu documento, vuelve a intentarlo.")
                hasError = true;
              });

            // ADDRESS UPLOAD
            let file2 = {
              user_id: this.state.userData.id,
              name: "COMPROBANTE_DOMICILIO",
              document: `data:image/jpg;base64,${this.state.file2.base64}`,
              isBase64: true
            }

            await UserService.storeDocuments(file2)
              .then(response => console.log(response.message))
              .catch(e => {
                Alert.alert("RFC", "Hubo un problema al subir tu documento, vuelve a intentarlo.")
                hasError = true;
              });

            // CLABE UPLOAD
            let file3 = {
              user_id: this.state.userData.id,
              name: "CLABE",
              document: `data:image/jpg;base64,${this.state.file3.base64}`,
              isBase64: true
            }

            await UserService.storeDocuments(file3)
              .then(response => console.log(response.message))
              .catch(e => {
                Alert.alert("CLABE", "Hubo un problema al subir tu documento, vuelve a intentarlo.")
                hasError = true;
              });

            // PROFILE PHOTO UPLOAD
            let file4 = {
              user_id: this.state.userData.id,
              name: "FOTO_PERFIL",
              document: `data:image/jpg;base64,${photo.base64}`,
              isBase64: true
            }

            await UserService.storeDocuments(file4)
              .then(response => console.log(response.message))
              .catch(e => {
                Alert.alert("Foto de perfil", "Hubo un problema al subir tu documento, vuelve a intentarlo.")
                hasError = true;
              });

            // REDIRECT
            if (!hasError) {
              this.setState({ isLoading: false });
              this.props.navigation.navigate("DocumentosSuccess");
            } else {
              this.setState({ isLoading: false, errorUploading: true });
              this.props.navigation.navigate("DocumentosStep1");
            }
          }
        }
      ])
    }
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        {
          this.state.openCamera
            ? (
              <Camera
                ref={ref => { this.camera = ref }}
                style={{ flex: 1, justifyContent: 'space-between' }}
                type={this.state.cameraType}>
                <View style={{ justifyContent: "center", alignItems: 'center' }}>
                  <View style={{ marginTop: 30 }}>
                    <Image source={Images.Icons.CamaraMarco} style={{ width: smallScreen ? 240 : 250, height: smallScreen ? 525 : 550 }} />
                  </View>

                  <Text style={[{ fontFamily: 'trueno', color: nowTheme.COLORS.WHITE, fontSize: 8, paddingTop: 5 }]}>Asegúrate de que el documento sea legible.</Text>

                  <TouchableOpacity
                    style={{ backgroundColor: 'transparent', marginTop: 10 }}
                    onPress={() => this.handleCameraPhoto()}
                  >
                    <Image source={Images.Icons.CamaraBoton} />
                  </TouchableOpacity>
                </View>
              </Camera>
            )
            : (
              <View style={{ height }}>
                <ScrollView>
                  <Block flex={1} middle space="between" style={styles.padded}>
                    <Image source={Images.Icons.MujerPerfil} style={[styles.itemGroup, { marginTop: 10 }]} />

                    <Image source={Images.Icons.Grupo4} style={[styles.imageGroup, styles.itemGroup, { marginTop: 20 }]} />

                    <Text style={[styles.title]}>Foto de perfil</Text>

                    <Text style={[styles.subtitle, { paddingBottom: 25 }]}>
                      (Obligatorio)
                    </Text>

                    <Text style={[styles.subtitle, styles.itemGroup]}>
                      Para comodidad y confianza del servicio debemos mostrar nuestra fotografía en el perfil de TAYDER.
                    </Text>
                    <Text style={[styles.subtitle, styles.itemGroup]}>
                      Te recomendamos tu fotografía muestre tu rostro y la parte superior de los hombros.
                    </Text>
                    <Text style={[styles.subtitle, styles.itemGroup, { paddingBottom: 40 }]}>
                      Evita: usar anteojos de sol, sombreros y una fotografía mal iluminada,
                    </Text>

                    <Block center style={{ marginBottom: 30 }}>
                      <Button
                        round
                        color={nowTheme.COLORS.BASE}
                        style={styles.button}
                        loading={this.state.isLoading}
                        disabled={this.state.isLoading}
                        onPress={() => this.setState({ openCamera: true })}>
                        <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                          TOMAR FOTO
                        </Text>
                      </Button>
                    </Block>
                  </Block>
                </ScrollView>
              </View>
            )
        }
      </Block>
    );
  }
}

export default withNavigation(DocumentosStep4Screen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.WHITE,
    fontSize: 24,
    textAlign: 'center',
  },
  itemGroup: {
    paddingVertical: 15,
  },
  subtitle: {
    fontFamily: 'trueno-light',
    fontSize: 16,
    color: nowTheme.COLORS.WHITE,
    textAlign: 'center',
  },
  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  imageCamara: {
    width: 50,
    height: 40,
  },
  imageGroup: {
    width: 50,
    height: 50
  }
});

