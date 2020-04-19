import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Appbar, Divider } from 'react-native-paper';
import color from 'src/assets/jss/colors';
import OptionItem from 'src/components/OptionItem';

import { useSelector, useDispatch } from 'react-redux';

const SettingsContainer = ({ navigation }) => {
  const [active, setActive] = useState();
  //const [timeToChange, setTimeToChange] = useState();

  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  useEffect(() => {});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color[theme].background,
    },
    optionContainer: {
      alignItems: 'center',
    },
    header: {
      backgroundColor: color[theme].primary,
    },
    divider: {
      backgroundColor: color[theme].background,
      height: 1,
    },
    listOption: {
      width: '95%',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRadius: 5,
      height: 'auto',
      padding: 25,
      margin: 5,
      backgroundColor: color[theme].primary,
      elevation: 12,
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
      <View style={styles.optionContainer}>
        <Surface style={styles.listOption}>
          <OptionItem
            text={'Active: '}
            theme={theme}
            value={active}
            onValueChange={() => {
              setActive(!active);
            }}
          />
          <Divider style={styles.divider} />
          <OptionItem
            text={'Dark Mode: '}
            theme={theme}
            value={theme === 'dark'}
            onValueChange={() => {
              dispatch({
                type: 'switchTheme',
                theme: theme === 'light' ? 'dark' : 'light',
              });
            }}
          />
        </Surface>
      </View>
    </View>
  );
};

export default SettingsContainer;
