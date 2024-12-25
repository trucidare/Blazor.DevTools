using System.Text.Json;
using System.Text.Json.Serialization;

namespace Blazor.DevTools.Components.Convertes;

public class IgnoreTypeConverter : JsonConverter<Type>
{
    public override bool CanConvert(Type typeToConvert)
        => typeToConvert == typeof(Type);

    public override Type Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => null!;

    public override void Write(Utf8JsonWriter writer, Type value, JsonSerializerOptions options)
    {
    }
}