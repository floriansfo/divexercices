export type DepositStatus = 'PENDING' | 'COMPLETE' | 'EXPIRED';

export function checkStatus(expire: Date, complete: Date | null, now: Date): DepositStatus {
    if (complete !== null) {
        return "COMPLETE";
    }
    if (now.getTime() >= expire.getTime()) {
        return "EXPIRED";
    }
    return "PENDING";
}