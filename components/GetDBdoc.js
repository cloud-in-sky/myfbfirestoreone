/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://github.com/benestudio/fakestagram/blob/cloud-firestore/App.js
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Dimensions, Button, TextInput } from 'react-native';
import firebase from 'react-native-firebase';

var screenwidth = Dimensions.get('window').width;

const Student = ({ student }) => {
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 10 }}>
            <View >
                <Text style={styles.itemText}>{student.StudentID} * {student.Firstname} {student.Surname}</Text>
            </View>
            <View >
                <Text style={styles.itemText}>{student.Address}</Text>
            </View>
        </View>
    );
};

export default class GetDBdoc extends Component<{}> {
    constructor() {
        super();
        this.ref = firebase.firestore().collection('StudentDB');
        this.unsubscribe = null;
        this.state = {
            students: [],
            loading: true,
            showAddNew: false,
            showDocLst: true,
            newStudentID: '',
            newFirstname: '',
            newSurname: '',
            newAddress: '',
        };
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const students = [];
        querySnapshot.forEach((doc) => {
            const { StudentID, Firstname, Surname, Address } = doc.data();
            students.push({
                key: doc.id, // Document ID
                doc, // DocumentSnapshot
                StudentID,
                Firstname,
                Surname,
                Address,
            });
        });
        this.setState({
            students,
            loading: false,
            showDocLst: true,
        });
    }

    _addNewDoc = () => {
        this.setState({
            showAddNew: true,
            showDocLst: false,
        });
    }

    _saveNewDoc = () => {
        this.ref.add({
            StudentID: this.state.newStudentID,
            Firstname: this.state.newFirstname,
            Surname: this.state.newSurname,
            Address: this.state.newAddress,
        });
        //After saving data to database, back to show doc list
        this.setState({
            showAddNew: false,
            showDocLst: true,
        });
    }

    _saveCancle = () => {
        this.setState({
            showAddNew: false,
            showDocLst: true,
        });
    }

    _flItemSeparator = () => {
        return (
            <View style={{ height: 2, width: "100%", backgroundColor: "skyblue" }} />
        );
    }

    _keyExtractor = (item, index) => String(index);

    render() {
        if (this.state.loading) {
            return <ActivityIndicator size="large" />;
        }

        if (this.state.showAddNew) {
            return (
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Add New Student</Text>
                    </View>
                    <Text style={styles.textTitle}>Student ID:</Text>
                    <TextInput
                        style={styles.textInput}
                        autoCapitalize="none"
                        placeholder="Student ID"
                        onChangeText={newStudentID => this.setState({ newStudentID })}
                        value={this.state.newStudentID}
                    />
                    <Text style={styles.textTitle}>Firstname:</Text>
                    <TextInput
                        style={styles.textInput}
                        autoCapitalize="none"
                        placeholder="Firstname"
                        onChangeText={newFirstname => this.setState({ newFirstname })}
                        value={this.state.newFirstname}
                    />
                    <Text style={styles.textTitle}>Surname:</Text>
                    <TextInput
                        style={styles.textInput}
                        autoCapitalize="none"
                        placeholder="Surname"
                        onChangeText={newSurname => this.setState({ newSurname })}
                        value={this.state.newSurname}
                    />
                    <Text style={styles.textTitle}>Home Address:</Text>
                    <TextInput
                        style={styles.textInput}
                        autoCapitalize="none"
                        placeholder="Home address"
                        onChangeText={newAddress => this.setState({ newAddress })}
                        value={this.state.newAddress}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', padding: 20 }}>
                        <View style={{ paddingRight: 30 }}>
                            <Button title="Save" onPress={() => this._saveNewDoc()} style={styles.buttonStyle} />
                        </View>
                        <View style={{ paddingLeft: 30 }}>
                            <Button title="Cancel" onPress={() => this._saveCancle()} style={styles.buttonStyle} />
                        </View>
                    </View>
                </View>
            )
        }

        //Display doc list
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Student Information</Text>
                </View>
                <FlatList
                    data={this.state.students}
                    ItemSeparatorComponent={this._flItemSeparator}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item }) => <Student student={item} />}
                />
                <Button title="Add New Student" onPress={() => this._addNewDoc()} />
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 5,
    },
    imageContainer: {
        width: screenwidth,
        height: 315,
        padding: 25,
        backgroundColor: '#fefefe',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: 300,
        // height: 300,
        marginBottom: 5,
    },
    textContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    title: {
        flex: 4,
    },
    likesContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        width: screenwidth,
        height: Platform.OS === 'ios' ? 70 : 50,
        backgroundColor: '#fefefe',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 16,
        paddingRight: 10,
    },
    textInput: {
        height: 40,
        width: screenwidth * 0.8,
        borderColor: '#7a42f4',
        borderWidth: 1,
        marginTop: 3
    },
    textTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingTop: 2,
    },
    buttonStyle: {
        padding: 20,
        margin: 10,
        backgroundColor: '#00BCD4',
        borderRadius: 3,
    },
});
