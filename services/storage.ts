import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types';

const KEY = '@cinbral:watchlist';

export async function getWatchlist(): Promise<Movie[]> {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function addToWatchlist(movie: Movie): Promise<void> {
  const list = await getWatchlist();
  if (!list.find(m => m.id === movie.id)) {
    await AsyncStorage.setItem(KEY, JSON.stringify([...list, movie]));
  }
}

export async function removeFromWatchlist(id: string): Promise<void> {
  const list = await getWatchlist();
  await AsyncStorage.setItem(KEY, JSON.stringify(list.filter(m => m.id !== id)));
}

export async function isInWatchlist(id: string): Promise<boolean> {
  const list = await getWatchlist();
  return list.some(m => m.id === id);
}