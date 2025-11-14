import type { PostgrestError } from "@supabase/supabase-js";

type SupabaseResponse<T> = PromiseLike<{
	data: T | null;
	error: PostgrestError | null;
}>;

type ResolveOptions<T> = {
	/**
	 * Provide a fallback when Supabase returns null (e.g. for selects that should default to []).
	 */
	fallbackValue?: T;
	/**
	 * Allow returning null without throwing (handy when callers expect nullable results).
	 */
	allowNull?: boolean;
	/**
	 * Custom error message layered on top of the Supabase error message.
	 */
	errorMessage?: string;
};

const formatError = (error: PostgrestError, fallback?: string) => {
	const detail = error.details || error.hint;
	const suffix = detail ? ` (${detail})` : "";
	return fallback
		? `${fallback}: ${error.message}${suffix}`
		: `${error.message}${suffix}`;
};

export async function resolveSupabase<T>(
	query: SupabaseResponse<T>,
	options: ResolveOptions<T> = {}
): Promise<T> {
	const { data, error } = await query;

	if (error) {
		throw new Error(formatError(error, options.errorMessage), {
			cause: error,
		});
	}

	if (data === null) {
		if (Object.prototype.hasOwnProperty.call(options, "fallbackValue")) {
			return options.fallbackValue as T;
		}

		if (options.allowNull) {
			return data as T;
		}

		throw new Error(
			options.errorMessage ?? "No data returned for this query."
		);
	}

	return data;
}
