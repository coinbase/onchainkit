import { ComponentTheme, ModePreference } from './types';


export function themeSelector(theme: ComponentTheme, mode: ModePreference): string {
  // Pass is componentTheme and mode, returns the "correct" component?
  // if mode === 'auto' 
    // return 'light' or 'dark' depending the the users OS preference.
  // if mode === 'light'
    // return 'light'
  // if mode === 'dark'
    // return 'dark'
  
  // Check if Theme is specified
    // if Theme is specified
      // return light version of the theme if mode is === 'light' or if mode === 'auto' and the OS preference is light
      // return dark version of the theme if mode is === 'dark' or if mode === 'auto' and the OS preference is dark
    
  
  // Check if the user prefers dark mode
  // You can use the prefers-color-scheme media query.
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log("prefers dark mode: ", prefersDarkMode)

  const isDarkMode = mode === 'dark' || (mode === 'auto' && prefersDarkMode);

  if (theme) {
    return isDarkMode ? `${theme}-dark` : `${theme}-light`;
  }

  return isDarkMode ? 'dark' : 'light';

}