/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ServiceIdentifier,
  ServiceIdentifierValue,
  ServiceVariant,
  Type,
} from './types.js';

import { DEFAULT_SERVICE_VARIANT } from './consts.js';
import { stableHash } from './stable-hash.js';

/**
 * 创建一个 ServiceIdentifier。
 *
 * ServiceIdentifier 用于标识某种类型的服务。通过标识符，你可以引用一个或多个服务
 * 而无需知道具体的实现，从而实现
 * [控制反转](https://en.wikipedia.org/wiki/Inversion_of_control)。
 *
 * @example
 * ```ts
 * // 定义一个接口
 * interface Storage {
 *   get(key: string): string | null;
 *   set(key: string, value: string): void;
 * }
 *
 * // 创建一个标识符
 * // 注意：强烈建议使用接口名作为标识符名称，
 * // 这样易于理解。在 TypeScript 中这样做是合法的。
 * const Storage = createIdentifier<Storage>('Storage');
 *
 * // 创建一个实现
 * class LocalStorage implements Storage {
 *   get(key: string): string | null {
 *     return localStorage.getItem(key);
 *   }
 *   set(key: string, value: string): void {
 *     localStorage.setItem(key, value);
 *   }
 * }
 *
 * // 将实现注册到标识符
 * services.addImpl(Storage, LocalStorage);
 *
 * // 从标识符获取实现
 * const storage = services.provider().get(Storage);
 * storage.set('foo', 'bar');
 * ```
 *
 * 使用标识符的好处：
 *
 * * 你可以轻松替换 `Storage` 的实现，而无需更改使用它的代码。
 * * 你可以轻松地为测试模拟一个 `Storage`。
 *
 * # 变体
 *
 * 有时，你可能想为同一个接口注册多个实现。
 * 例如，你可能想同时拥有 `LocalStorage` 和 `SessionStorage` 作为 `Storage`，
 * 并同时使用它们。
 *
 * 在这种情况下，你可以使用 `variant` 来区分它们。
 *
 * ```ts
 * const Storage = createIdentifier<Storage>('Storage');
 * const LocalStorage = Storage('local');
 * const SessionStorage = Storage('session');
 *
 * services.addImpl(LocalStorage, LocalStorageImpl);
 * services.addImpl(SessionStorage, SessionStorageImpl);
 *
 * // 从标识符获取实现
 * const localStorage = services.provider().get(LocalStorage);
 * const sessionStorage = services.provider().get(SessionStorage);
 * const storage = services.provider().getAll(Storage); // { local: LocalStorageImpl, session: SessionStorageImpl }
 * ```
 *
 * @param name 标识符的唯一名称。
 * @param variant 标识符的默认变体名称，可以通过 `identifier("variant")` 覆盖。
 */
export function createIdentifier<T>(
  name: string,
  variant: ServiceVariant = DEFAULT_SERVICE_VARIANT
): ServiceIdentifier<T> & ((variant: ServiceVariant) => ServiceIdentifier<T>) {
  return Object.assign(
    (variant: ServiceVariant) => {
      return createIdentifier<T>(name, variant);
    },
    {
      /* 这两个是重点消费对象， */
      identifierName: name, // 基本名称
      variant, // 变体名称
    }
  ) as never;
}

/**
 * Convert the constructor into a ServiceIdentifier.
 * As we always deal with ServiceIdentifier in the DI container.
 *
 * @internal
 */
export function createIdentifierFromConstructor<T>(
  target: Type<T>
): ServiceIdentifier<T> {
  return createIdentifier<T>(`${target.name}${stableHash(target)}`);
}

export function parseIdentifier(input: any): ServiceIdentifierValue {
  if (input.identifierName) {
    return input as ServiceIdentifierValue;
  } else if (typeof input === 'function' && input.name) {
    return createIdentifierFromConstructor(input);
  } else {
    throw new Error('Input is not a service identifier.');
  }
}
