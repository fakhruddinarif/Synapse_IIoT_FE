/** Form model for login. */
export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

/** Generic select option shape. */
export interface SelectOption<T = string> {
  value: T;
  label: string;
}
