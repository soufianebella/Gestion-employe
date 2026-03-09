import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar"
      [style.background-color]="bgColor()"
      [style.color]="textColor()">
      {{ initials() }}
    </div>
  `,
  styles: [`
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }
  `]
})
export class AvatarComponent {

  // ── Inputs ──────────────────────────────────────────────
  nom = input.required<string>();
  prenom  = input.required<string>();

  // ── Calculs automatiques ────────────────────────────────
  initials = computed(() =>
    `${this.nom().charAt(0)}${this.prenom().charAt(0)}`.toUpperCase()
  );

  bgColor = computed(() => {
    const colors: Record<string, string> = {
      'A': '#FFD580', // jaune  — Arman, Arif
      'S': '#A8D8EA', // bleu   — Sabbir
      'H': '#B5EAD7', // vert   — Hansda
    };
    const key = this.prenom().charAt(0).toUpperCase();
    return colors[key] ?? '#D3D3D3'; // gris par défaut
  });

  textColor = computed(() => '#333333');
}
