export const sleep = (time: number) =>
    new Promise((res) => setTimeout(res, time));
  
  export const calculateWindowSize = (windowWidth: number) => {
    if (windowWidth >= 1200) {
      return 'lg-screen';
    }
    if (windowWidth >= 992) {
      return 'md-screen';
    }
    if (windowWidth >= 768) {
      return 'sm-screen';
    }
    return 'xs-screen';
  };
  
  export const setWindowClass = (classList: string) => {
    const window: HTMLElement | null =
      document && document.getElementById('root');
    if (window) {
      window.classList = classList;
    }
  };
  export const addWindowClass = (classList: string) => {
    const window: HTMLElement | null =
      document && document.getElementById('root');
    if (window) {
      window.classList.add(classList);
    }
  };
  
  export const removeWindowClass = (classList: string) => {
    const window: HTMLElement | null =
      document && document.getElementById('root');
    if (window) {
      window.classList.remove(classList);
    }
  };
  
  export const scrollbarVisible = (element: HTMLElement) => {
    return element.scrollHeight > element.clientHeight;
  };
  