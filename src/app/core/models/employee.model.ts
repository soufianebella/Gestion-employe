export type EmployeeRole = 'ADMIN' | 'USER' | 'JAVA_DEV' | 'MANAGER';

export interface Employee {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: EmployeeRole;
}
