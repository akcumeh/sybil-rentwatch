export function gradePayment(
    dueDate: Date,
    paidDate: Date,
    frequency: 'monthly' | 'annual'
): { grade: string; points: number } {
    const diffDays = Math.floor(
        (paidDate.getTime() - dueDate.getTime()) / 86_400_000
    ); // negative = paid before due

    if (frequency === 'annual') {
        if (diffDays <= -1) return { grade: 'early_plus', points: 100 };
        if (diffDays === 0)  return { grade: 'early',     points: 90  };
        if (diffDays <= 21)  return { grade: 'on_time',   points: 80  };
        return                      { grade: 'late',      points: 50  };
    }

    // monthly
    if (diffDays <= -3) return { grade: 'early_plus', points: 100 };
    if (diffDays <= 0)  return { grade: 'early',      points: 90  };
    if (diffDays <= 4)  return { grade: 'on_time',    points: 80  };
    return                     { grade: 'late',       points: 50  };
}

export function gradeMaintenance(responseDays: number): number {
    if (responseDays <= 1)  return 100;
    if (responseDays <= 3)  return 80;
    if (responseDays <= 7)  return 60;
    if (responseDays <= 30) return 30;
    return 0;
}
