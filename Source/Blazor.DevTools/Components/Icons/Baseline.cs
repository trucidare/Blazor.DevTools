using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components.Icons;

public static class Baseline
{
    public static MarkupString Page => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><rect width="36" height="36" x="6" y="6" rx="3"/><path stroke-linecap="round" d="M6 17h36M17 42V17"/></g></svg>
        """
    );

    public static MarkupString Overview => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M18.5 21a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9ZM10 7h4M1.5 14.5S5.5 5 6 4s1.5-1 2-1s2 0 2 2v11m-4.5 5a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9Zm17-6.5S18.5 5 18 4s-1.5-1-2-1s-2 0-2 2v11m-4 0h4"/></svg>
        """
    );

    public static MarkupString Components => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m3.553 18.895l4 2a1 1 0 0 0 .894 0L12 19.118l3.553 1.776a.99.99 0 0 0 .894.001l4-2c.339-.17.553-.516.553-.895v-5c0-.379-.214-.725-.553-.895L17 10.382V6c0-.379-.214-.725-.553-.895l-4-2a1 1 0 0 0-.895 0l-4 2C7.214 5.275 7 5.621 7 6v4.382l-3.447 1.724A1 1 0 0 0 3 13v5c0 .379.214.725.553.895M8 12.118l2.264 1.132l-2.913 1.457l-2.264-1.132zm4-2.5l3-1.5v2.264l-3 1.5zm6.264 3.632l-2.882 1.441l-2.264-1.132L16 12.118zM8 18.882l-.062-.031V16.65L11 15.118v2.264zm8 0v-2.264l3-1.5v2.264zM12 5.118l2.264 1.132l-2.882 1.441l-2.264-1.132z"/></svg>
        """
    );

    public static MarkupString Config => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v3m-2 4.25h4M5 11v10m7-4v4m-2-7.75h4M12 3v10m7-10v3m-2 4.25h4M19 11v10"/></svg>
        """
    );

    public static MarkupString Module => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5.5h-11a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1"/><path d="M7 .5v2.132a1.5 1.5 0 1 0 0 2.236v4.264a1.5 1.5 0 1 1 0 2.236V13.5"/><path d="M.5 7h2.132a1.5 1.5 0 1 0 2.236 0h4.264a1.5 1.5 0 1 1 2.236 0H13.5"/></g></svg>
        """
    );

    public static MarkupString Plugin => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707l1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562l-1.414-1.414l1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56l-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0"/></svg>
        """
    );

    public static MarkupString Reference => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g fill="currentColor" fill-rule="evenodd"><path d="M106.667 85.333V128c0 80.756 64.102 146.54 144.2 149.246l5.133.087h149.333V320H256c-104.145 0-188.924-82.919-191.918-186.34L64 128.001V85.333z"/><path fill-rule="nonzero" d="m315.582 217.751l30.17-30.17l111.085 111.085l-111.085 111.085l-30.17-30.17l80.898-80.915z"/></g></svg>
        """
    );

    public static MarkupString ChevronDown => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m14.5 8.5l-4 4l-4-4"/></svg>
        """
    );

    public static MarkupString NoConfig => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M30 24v-2h-2.101a5 5 0 0 0-.732-1.753l1.49-1.49l-1.414-1.414l-1.49 1.49A5 5 0 0 0 24 18.101V16h-2v2.101a5 5 0 0 0-1.753.732l-1.49-1.49l-1.414 1.414l1.49 1.49A5 5 0 0 0 18.101 22H16v2h2.101c.129.626.378 1.221.732 1.753l-1.49 1.49l1.414 1.414l1.49-1.49a5 5 0 0 0 1.753.732V30h2v-2.101a5 5 0 0 0 1.753-.732l1.49 1.49l1.414-1.414l-1.49-1.49A5 5 0 0 0 27.899 24zm-7 2a3 3 0 1 1 0-6a3 3 0 0 1 0 6"/><path fill="currentColor" d="m23.499 9.085l-6.792-6.792A1 1 0 0 0 16 2H6c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h8v-2H6V4h8v6c0 1.103.897 2 2 2h6.292c.693 0 1.312-.414 1.577-1.054c.266-.64.12-1.37-.37-1.861M16 10V4.414L21.585 10z"/></svg>
        """
    );

    public static MarkupString Blazor => new(
        """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M -165.769669921 162.394409646 c -38 37 -110 35 -135 -1 s -14 -74 2 -93 s 43 -28 63 -27 s 50 -2 66 -23 c -6 18 -7 18 -12 33 c 28 -8 37 -12 52 -43 c 28 49 1 96 -20 120 s -47 33 -83 36 s -58 -23 -57 -53 s 29 -46 51 -46 s 45 24 46 45 s -8 20 -11 20 s -10 -2 -10 -22 s -2 -26 -18 -27 s -43 10 -42 30 s 12 33 29 34 s 18 -5 23 -12 c 9 15 19 10 26 8 s 18 -17 15 -40 s -35 -49 -58 -49 s -65 17 -66 63 s 51 89 137 45 z m -60 -46 v -20 h -20 c -10 0 -18 5 -17 20 s 10 15 15 16 s 22 0 22 -15 z" fill="#ffb506"></path></svg>
        """
    );
}