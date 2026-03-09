import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/employees';

  // ── État ────────────────────────────────────────────────
  private _employees  = signal<Employee[]>([]);
  private _searchTerm = signal<string>('');
  private _loading    = signal<boolean>(false);
  private _error      = signal<string | null>(null);

  // ── Exposition publique (lecture seule) ─────────────────
  readonly employees  = this._employees.asReadonly();
  readonly loading    = this._loading.asReadonly();
  readonly error      = this._error.asReadonly();

  // ── Recherche côté client ───────────────────────────────
  readonly filteredEmployees = computed(() => {
    const term = this._searchTerm().toLowerCase().trim();
    if (!term) return this._employees();
    return this._employees().filter(e =>
      e.nom.toLowerCase().includes(term) ||
      e.prenom.toLowerCase().includes(term)  ||
      e.email.toLowerCase().includes(term)
    );
  });

  // ── READ — GET /api/employees ───────────────────────────
  loadEmployees(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Employee[]>(this.API_URL).subscribe({
      next: (data) => {
        this._employees.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Erreur lors du chargement des employés');
        this._loading.set(false);
        console.error(err);
      }
    });
  }

  // ── CREATE — POST /api/employees ────────────────────────
  addEmployee(data: Omit<Employee, 'id'>): void {
    this._loading.set(true);

    this.http.post<Employee>(this.API_URL, data).subscribe({
      next: (created) => {
        this._employees.update(list => [...list, created]);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Erreur lors de la création');
        this._loading.set(false);
        console.error(err);
      }
    });
  }

  // ── UPDATE — PUT /api/employees/:id ─────────────────────
  updateEmployee(updated: Employee): void {
    this._loading.set(true);

    this.http.put<Employee>(`${this.API_URL}/${updated.id}`, updated).subscribe({
      next: (result) => {
        this._employees.update(list =>
          list.map(e => e.id === result.id ? result : e)
        );
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Erreur lors de la mise à jour');
        this._loading.set(false);
        console.error(err);
      }
    });
  }

  // ── DELETE — DELETE /api/employees/:id ──────────────────
  deleteEmployee(id: number): void {
    this._loading.set(true);

    this.http.delete<void>(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this._employees.update(list => list.filter(e => e.id !== id));
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Erreur lors de la suppression');
        this._loading.set(false);
        console.error(err);
      }
    });
  }

  // ── SEARCH ───────────────────────────────────────────────
  updateSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }
}
