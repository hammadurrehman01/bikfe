export type OmitTypeName<T> = Omit<T, '__typename'>;

export type TimeStampRemoved<T> = Omit<
  OmitTypeName<T>,
  'createdAt' | 'updatedAt'
>;

export type MakeOptional<Type, Key extends keyof Type> = Omit<
  TimeStampRemoved<Type>,
  Key
> &
  Partial<Pick<Type, Key>>;
