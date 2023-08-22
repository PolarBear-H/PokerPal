import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class SettingsPage extends Component {
    render() {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Text>Settings</Text>
              {/* Allow users to configure app preferences */}
            </View>
          );
    }
};

