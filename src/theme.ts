export const colors = { background: '#09090b', card: '#18181b', cardLight: '#27272a', text: '#fafafa', muted: '#a1a1aa', primary: '#22c55e', blue: '#3b82f6', warning: '#f59e0b', danger: '#ef4444', border: '#3f3f46' };
export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
