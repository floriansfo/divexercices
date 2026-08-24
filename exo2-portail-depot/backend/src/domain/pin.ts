export function validpinformat(pin: string): boolean {
        return /^\d{4}$/.test(pin);
}

export function locked(lockuntil: Date | null, now: Date): boolean {
    if (lockuntil === null) 
    {
        return false;
    } 
    return lockuntil.getTime() > now.getTime() 
}