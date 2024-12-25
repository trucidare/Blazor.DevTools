namespace DevTools.Examples.Server.Components.Pages;

public partial class Counter
{
    private int muh = 22;
    public int CurrentCount { get; set; }

    private void IncrementCount()
    {
        CurrentCount++;
    }
}