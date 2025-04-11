import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VerticalMenu from '../VerticalMenu';

const HamburguerMenu = () => {
    const [visible, setVisible] = useState(false);

    const toggleDrawer = () => {
        setVisible(!visible);
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleDrawer} style={styles.hamburgerButton}>
                <Icon name="menu" size={30} color="#666666" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={toggleDrawer}
            >
                <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1}>
                    <TouchableOpacity activeOpacity={1}>
                        <VerticalMenu />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    hamburgerButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
    },
});

export default HamburguerMenu;
