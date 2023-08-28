import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

type Item = {
  key: string;
  text: string;
};

const data: Item[] = [
  { key: '1', text: 'Item 1' },
  { key: '2', text: 'Item 2' },
  { key: '3', text: 'Item 3' },
];

const StatisticsPage: React.FC = () => {
  const [listData, setListData] = React.useState(data);

  const handleDelete = (rowKey: string) => {
    const newData = [...listData];
    const index = newData.findIndex((item) => item.key === rowKey);
    newData.splice(index, 1);
    setListData(newData);
  };

  //console.log('StatisticsPage');
  return (
    <View style={styles.container}>
      <SwipeListView
        data={listData}
        renderItem={({ item }) => (
          <View style={styles.rowFront}>
            <Text>{item.text}</Text>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => handleDelete(item.key)}
            >
              <Text style={styles.backTextWhite}>删除</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#ff0000',
    right: 0,
  },
  backTextWhite: {
    color: '#ffffff',
  },
});

export default StatisticsPage;