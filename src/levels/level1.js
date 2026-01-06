export default [
{ time: 0.6, type:'spawn', pattern:'sine', count:4, x:40, spacing:88,
colour:'lightblue' },
{ time: 4.0, type:'spawn', pattern:'zig', count:5, x:20, spacing:60,
colour:'purple' },
{ time: 8.6, type:'spawn', pattern:'dive', count:3, x:80, spacing:120,
colour:'orange' },
{ time: 14.0, type:'spawn', pattern:'hover', count:2, x:120, spacing:140,
colour:'green' },
{ time: 20.0, type:'spawn', pattern:'follow', count:2, x:60, spacing:160,
colour:'pink' },
// mid-level: clustered wave
{ time: 26.5, type:'spawn', pattern:'sine', count:6, x:12, spacing:72,
colour:'#88f' },
{ time: 34.0, type:'spawn', pattern:'zig', count:8, x:8, spacing:56,
colour:'#a5f' },
// lead into boss (boss implementation to follow)
{ time: 48.0, type:'spawn', pattern:'sine', count:10, x:8, spacing:44,
colour:'#f55' }
];
