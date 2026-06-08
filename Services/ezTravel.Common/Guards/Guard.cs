namespace ezTravel.Common.Guards;

public static class Guard
{
    public static void AgainstNull(object? value, string name)
    {
        if (value == null)
            throw new ArgumentNullException(name);
    }

    public static void AgainstNullOrEmpty(string? value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException($"{name} is required");
    }
}
