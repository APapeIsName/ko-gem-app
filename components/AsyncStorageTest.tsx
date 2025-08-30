import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function AsyncStorageTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAsyncStorage = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('AsyncStorage 테스트 시작...');
      
      // 1. 간단한 문자열 저장/불러오기 테스트
      addResult('1. 문자열 저장/불러오기 테스트');
      await AsyncStorage.setItem('test-string', 'Hello AsyncStorage');
      const stringValue = await AsyncStorage.getItem('test-string');
      addResult(`저장된 문자열: ${stringValue}`);
      
      // 2. 객체 저장/불러오기 테스트
      addResult('2. 객체 저장/불러오기 테스트');
      const testObject = { name: 'Test Plan', date: new Date().toISOString() };
      await AsyncStorage.setItem('test-object', JSON.stringify(testObject));
      const objectValue = await AsyncStorage.getItem('test-object');
      const parsedObject = JSON.parse(objectValue || '{}');
      addResult(`저장된 객체: ${JSON.stringify(parsedObject)}`);
      
      // 3. 배열 저장/불러오기 테스트
      addResult('3. 배열 저장/불러오기 테스트');
      const testArray = [{ id: 1, title: 'Plan 1' }, { id: 2, title: 'Plan 2' }];
      await AsyncStorage.setItem('test-array', JSON.stringify(testArray));
      const arrayValue = await AsyncStorage.getItem('test-array');
      const parsedArray = JSON.parse(arrayValue || '[]');
      addResult(`저장된 배열: ${JSON.stringify(parsedArray)}`);
      
      // 4. 모든 키 확인
      addResult('4. 저장된 모든 키 확인');
      const allKeys = await AsyncStorage.getAllKeys();
      addResult(`저장된 키들: ${allKeys.join(', ')}`);
      
      // 5. 특정 키 존재 여부 확인
      addResult('5. 키 존재 여부 확인');
      const hasStringKey = await AsyncStorage.getItem('test-string') !== null;
      const hasObjectKey = await AsyncStorage.getItem('test-object') !== null;
      addResult(`test-string 키 존재: ${hasStringKey}`);
      addResult(`test-object 키 존재: ${hasObjectKey}`);
      
      addResult('✅ AsyncStorage 테스트 완료!');
      
    } catch (error) {
      addResult(`❌ AsyncStorage 테스트 실패: ${error}`);
      console.error('AsyncStorage 테스트 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestData = async () => {
    try {
      await AsyncStorage.removeItem('test-string');
      await AsyncStorage.removeItem('test-object');
      await AsyncStorage.removeItem('test-array');
      addResult('테스트 데이터 삭제 완료');
    } catch (error) {
      addResult(`테스트 데이터 삭제 실패: ${error}`);
    }
  };

  const testOurStorageService = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('우리 StorageService 테스트 시작...');
      
      // StorageService import 테스트
      const { saveToStorage, loadFromStorage, STORAGE_KEYS } = await import('@/services/storage/asyncStorage');
      
      addResult('StorageService import 성공');
      
      // 테스트 데이터 저장
      const testPlan = { id: 'test-1', title: 'Test Plan', date: new Date().toISOString() };
      await saveToStorage('test-plan', testPlan);
      addResult('테스트 계획 저장 완료');
      
      // 테스트 데이터 불러오기
      const loadedPlan = await loadFromStorage('test-plan');
      addResult(`불러온 계획: ${JSON.stringify(loadedPlan)}`);
      
      // STORAGE_KEYS 확인
      addResult(`STORAGE_KEYS: ${JSON.stringify(STORAGE_KEYS)}`);
      
      addResult('✅ StorageService 테스트 완료!');
      
    } catch (error) {
      addResult(`❌ StorageService 테스트 실패: ${error}`);
      console.error('StorageService 테스트 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runPerformanceTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('성능 테스트 시작...');
      
      const { savePlansBatch, loadPlansBatch } = await import('@/services/storage/asyncStorage');
      
      // 테스트 데이터 생성 (100개의 계획)
      const testPlans = Array.from({ length: 100 }, (_, i) => ({
        id: `test-${i}`,
        title: `Test Plan ${i}`,
        date: new Date().toISOString(),
        category: 'PERSONAL',
        priority: 'MEDIUM',
        status: 'ACTIVE'
      }));
      
      addResult(`테스트 데이터 생성 완료: ${testPlans.length}개 계획`);
      
      // 저장 성능 테스트
      const saveStart = performance.now();
      await savePlansBatch(testPlans);
      const saveEnd = performance.now();
      const saveTime = saveEnd - saveStart;
      
      addResult(`저장 시간: ${saveTime.toFixed(2)}ms`);
      
      // 불러오기 성능 테스트
      const loadStart = performance.now();
      const loadedPlans = await loadPlansBatch();
      const loadEnd = performance.now();
      const loadTime = loadEnd - loadStart;
      
      addResult(`불러오기 시간: ${loadTime.toFixed(2)}ms`);
      addResult(`불러온 계획 수: ${loadedPlans.length}`);
      
      // 개별 계획 접근 성능 테스트
      const individualStart = performance.now();
      for (let i = 0; i < 10; i++) {
        const plan = loadedPlans[i];
        if (plan) {
          // 개별 계획 접근 시뮬레이션
          const _ = plan.title + plan.category;
        }
      }
      const individualEnd = performance.now();
      const individualTime = individualEnd - individualStart;
      
      addResult(`개별 계획 접근 시간 (10개): ${individualTime.toFixed(2)}ms`);
      
      addResult('✅ 성능 테스트 완료!');
      
    } catch (error) {
      addResult(`❌ 성능 테스트 실패: ${error}`);
      console.error('성능 테스트 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage 테스트</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="AsyncStorage 직접 테스트" 
          onPress={testAsyncStorage}
          disabled={isLoading}
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button 
          title="우리 StorageService 테스트" 
          onPress={testOurStorageService}
          disabled={isLoading}
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button 
          title="테스트 데이터 정리" 
          onPress={clearTestData}
          disabled={isLoading}
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button 
          title="성능 테스트" 
          onPress={runPerformanceTest}
          disabled={isLoading}
        />
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>테스트 결과:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
    fontFamily: 'monospace',
  },
});
