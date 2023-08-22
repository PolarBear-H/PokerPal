import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
    navigation?: any;
  }
  
export default class MainPage extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View>
              <Text>Welcome to Texas Hold'em Poker App!</Text>
              <Button
                title="Record Score"
                onPress={() => this.props.navigation.navigate('RecordScorePage')}
              />
              <Button
                title="View History"
                onPress={() => this.props.navigation.navigate('HistoryReview')}
              />
            </View>
          );
    } 
};
