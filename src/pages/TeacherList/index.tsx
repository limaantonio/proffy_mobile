import React, { useState, useEffect } from 'react';
import {View, Text} from 'react-native';
import {Feather} from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import Favorites from '../Favorites';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeek_day] = useState('');
  const [time, setTime] = useState('');

  const [teachers, setTeachers] = useState([]);

  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersID = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          }
        )
        setFavorites(favoritedTeachersID);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  })

  function handleToohleFilterVisible(){
    setFilterVisible(!isFilterVisible)
  }

  async function handleFiltersSubmit(){
    loadFavorites();
    const response = await api.get('classes', {
      params:{
        subject,
        week_day,
        time
      }
    });

    setTeachers(response.data);
    setFilterVisible(false)
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Proffs disponíveis" 
        headerRight={(
          <BorderlessButton onPress={handleToohleFilterVisible}>
            <Feather name= "filter" size={20} color="#fff"/>
          </BorderlessButton>
        )}
      >
        {isFilterVisible && (<View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              placeholderTextColor= "#c1bccc"
              style={styles.input}
              placeholder="Qual a matéria?"
              value={subject}
              onChangeText={text => setSubject(text)}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
              <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  placeholderTextColor= "#c1bccc"
                  style={styles.input}
                  placeholder="Qual o dia?"
                  value={week_day}
                  onChangeText={text => setWeek_day(text)}
                />
              </View>

              <View style={styles.inputBlock}>
              <Text style={styles.label}>Horário</Text>
                <TextInput
                  placeholderTextColor= "#c1bccc"
                  style={styles.input}
                  placeholder="Qual horário?"
                  value={time}
                  onChangeText={text => setTime(text)}
                />
              </View>
            </View>

            <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>
      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher:Teacher) => 
          <TeacherItem 
            key={teacher.id} 
            teacher={teacher}
            favorited={favorites.includes(teacher.id)}
          />)}
      </ScrollView>
    </View>
  )
 
}

export default TeacherList;