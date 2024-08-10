export const changeHandler = (
  event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  const value = (event as React.ChangeEvent<HTMLInputElement>).target.value; // ChangeEvent로 처리
  setState(value);
};
