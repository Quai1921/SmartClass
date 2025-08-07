import type { TeacherResponse } from "../../infrastructure/interfaces/teachers.response";

export const extractTeacherOptions = (teachers: TeacherResponse[]) => {
    const grades = new Set<number>();
    const groups = new Set<string>();
    const shifts = new Set<string>();
    const performances = new Set<number>();
    const states = new Set<string>();

    teachers.forEach((teacher) => {
        teacher.currentAssignments.forEach((a) => {
            grades.add(a.grade);
            groups.add(a.group);
            shifts.add(a.shift);
            performances.add(a.performance);
        });
        states.add(teacher.status);
    });

    return {
        gradeOptions: Array.from(grades)
            .sort((a, b) => a - b)
            .map((g) => ({ label: `${g}°`, value: g.toString() })),
        groupOptions: Array.from(groups).map((g) => ({ label: g, value: g })),
        shiftOptions: Array.from(shifts).map((s) => ({
            label: s === 'MORNING' ? 'Mañana' : 'Tarde',
            value: s,
        })),
        performanceOptions: Array.from(performances).map((p) => ({
            label: `${p}`,
            value: p.toString(),
        })),        stateOptions: Array.from(states).map((s) => ({
            label: s === 'ACTIVE' ? 'Activo' : 'Inactivo',
            value: s,
        })),
    };
};
