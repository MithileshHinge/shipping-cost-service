export default interface ICache {
  /**
   * Return value from cache
   * @returns Promise to return the value for given key, null if key not found
   * @throws CacheError if operation failed
   */
  getValue(key: string): Promise<number| null>;

  /**
   * Set value for a given key in cache
   * @throws CacheError if operation failed
   */
  setValue(key: string, value: number): Promise<void>;
}