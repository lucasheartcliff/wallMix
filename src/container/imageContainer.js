import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {Appbar, FAB} from 'react-native-paper';
import selectImage from 'src/services/selectImage';
import color from 'src/assets/jss/colors';
import ImageCard from 'src/components/ImageCard';
import setBackgroundTask from 'src/services/headless';
import {
  openDatabase,
  insertOnDatabase,
  fetchOnDatabase,
} from 'src/services/database';

let numberGrid = 3;

const setImageOnList = async setState => {
  try {
    const realm = await openDatabase();
    let res = await fetchOnDatabase(realm, 'image');
    let data = [];
    for (let i = 0; i < res.length; i++) {
      data.push(res[`${i}`]);
    }

    await setState(data);
  } catch (error) {
    console.error(error);
  }
};

const getImageFromStorage = async setState => {
  try {
    const imagesArray = await selectImage();
    const realm = await openDatabase();

    await imagesArray.map(image => {
      insertOnDatabase(realm, 'image', {uri: image.path});
    });

    setImageOnList(setState);
  } catch (error) {
    console.error(error);
  }
};

const ImageContainer = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [screenWidth, setScreenWidth] = useState();
  const [selected, setSelected] = useState(new Map());
  const [editMode, setEditMode] = useState(false);
  const theme = 'light';

  const onSelect = useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));
      setSelected(newSelected);
      setEditMode(
        checkEditMode()
      )
    },
    [selected],
  );

  const checkEditMode = () => {
    for (const [key, value] of selected) {
      if (value) {
        return true
      }
    }
    return false
  };
  
  useEffect(() => {
    const onChange = result => {
      let {width, height} = result.screen;

      if (width > height) {
        width = width * 0.88;
      } else {
        width = width * 0.93;
      }

      let itemWidth = width / numberGrid;

      setScreenWidth(itemWidth);
    };

    Dimensions.addEventListener('change', onChange);

    onChange({screen: Dimensions.get('screen')});
    setImageOnList(setImages);
    // setBackgroundTask({timeout:3600})
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color[theme].background,
    },
    header: {
      backgroundColor: color[theme].primary,
    },
    listImage: {
      flex: 1,
      alignItems: 'flex-start',
    },
    image: {
      width: screenWidth,
      height: screenWidth,
      margin: 3,
      elevation: 6,
    },
    fab: {
      position: 'absolute',
      backgroundColor: color[theme].primary,
      color: color.white,
      margin: 15,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon={'menu'}
          color={color[theme].secondary}
          onPress={() => navigation.toggleDrawer()}
        />
      </Appbar.Header>
      <View style={styles.listImage}>
        <FlatList
          data={images}
          keyExtractor={item => item.uri}
          numColumns={numberGrid}
          renderItem={({item}) => {
            return (
              <ImageCard
                uri={item.uri}
                style={styles.image}
                selected={!!selected.get(item.uri)}
                onPress={() => {
                  if (editMode) {
                    onSelect(item.uri);
                  }
                }}
                onLongPress={() => {
                  onSelect(item.uri);
                  setEditMode(true);
                }}
              />
            );
          }}
          extraData={selected}
        />
      </View>
      <FAB
        style={styles.fab}
        icon="image-plus"
        onPress={() => getImageFromStorage(setImages)}
      />
    </View>
  );
};

export default ImageContainer;
