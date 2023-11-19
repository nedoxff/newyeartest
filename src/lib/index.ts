import { writable, type Writable } from 'svelte/store';
import { AppState } from '$lib/types/AppState';
import { randomString } from './helpers/RandomHelpers';

export const loaded: Writable<boolean> = writable(false);
export const state: Writable<AppState> = writable(AppState.Introduction);
export const result: Writable<[string, boolean]> = writable(['', false]);

export const loadedFolders: Map<string, string[]> = new Map<string, string[]>();

export const username: Writable<string> = writable('');
export const userid: string = randomString();
export const cardData: Writable<Blob | undefined> = writable(undefined); // stores the entire employee card in blob format
export const profile: number[] = []; // stores the answers