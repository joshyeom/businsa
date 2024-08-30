export const changeHandler = <T extends string | number>(
  event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  const target = event.target as HTMLInputElement;
  const value = target.value as unknown as T;
  setState(value)
};
