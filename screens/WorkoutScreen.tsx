import React , {useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { fetchFromApi } from '../api/exerciseClient';
import { Exercise, WorkoutSet } from '../types/exercise';
import { MUSCLE_GROUPS, MuscleGroup } from '../constants/muscles';


export default function WorkoutScreen () {
const [exercises, setExercise] = useState<Exercise[]> ([]);
const [selectedExercise, setSelectedExercise] = useState<Exercise | null> (null);
const [step, setStep] = useState<'TYPE' | 'MUSCLE' | 'EXERCISES'| 'LOGGING'> ('TYPE');
const [loading, setLoading] = useState(false);


const TypeSelect = async (type: 'cardio' | 'strength') => {
  if (type === 'cardio') {
      setLoading(true);
      const data = await fetchFromApi('?type=cardio');
      setExercise(data);
      setLoading(false);
      setStep('EXERCISES');
    } else {
      setStep('MUSCLE');
    }
  };
const handleMuscleSelect = async (muscle: MuscleGroup) => {
    setLoading(true);
    const data = await fetchFromApi(`?type=strength&muscle=${muscle}`);
    setExercise(data);
    setLoading(false);
    setStep('EXERCISES');
  };


if (loading) return <ActivityIndicator size="large" />;
 

return (
<View style={styles.container}> 
  {step === 'TYPE' && (
    <View>
      <Text style={styles.title}>What's the plan today?</Text>
          <TouchableOpacity style={styles.button} onPress={() => TypeSelect('strength')}>
            <Text>Strength Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => TypeSelect('cardio')}>
            <Text>Cardio</Text>
          </TouchableOpacity>
</View>
  )}
{step === 'MUSCLE' &&(
  <FlatList
  data={MUSCLE_GROUPS}
  keyExtractor={(item) => item}
  renderItem={({item}) => (
    <TouchableOpacity style={styles.button} onPress={() => handleMuscleSelect(item)}>
              <Text>{item.replace('_', ' ').toUpperCase()}</Text>
            </TouchableOpacity>
  )}
  ></FlatList>
)}
{step === 'EXERCISES' && (
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => { setSelectedExercise(item); setStep('LOGGING'); }}
            >
              <Text style={styles.bold}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      
      {step === 'LOGGING' && selectedExercise && (
        <View>
          <Text style={styles.title}>{selectedExercise.name}</Text>
          <Text>{selectedExercise.instructions}</Text>
        
          <TouchableOpacity onPress={() => setStep('TYPE')}>
            <Text style={styles.backButton}>Start Over</Text>
          </TouchableOpacity>
        </View>
      )}
</View>
  );
};

const styles = StyleSheet.create({
container: { flex: 1, padding: 20, backgroundColor: '#fff' ,paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 8 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  bold: { fontWeight: 'bold' },
  backButton: { color: 'blue', marginTop: 20 }
});

