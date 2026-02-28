const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMenus() {
    console.log('Fetching navigation_menus...');
    const { data, error } = await supabase
        .from('navigation_menus')
        .select('*')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching menus:', error);
    } else {
        // Build tree for display
        const menuMap = new Map();
        const roots = [];

        data.forEach(item => {
            menuMap.set(item.id, { ...item, children: [] });
        });

        data.forEach(item => {
            if (item.parent_id) {
                const parent = menuMap.get(item.parent_id);
                if (parent) parent.children.push(menuMap.get(item.id));
            } else {
                roots.push(menuMap.get(item.id));
            }
        });

        function printMenu(item, indent = '') {
            console.log(`${indent}- [${item.id}] ${item.title} (${item.href})`);
            item.children.forEach(child => printMenu(child, indent + '  '));
        }

        roots.forEach(root => printMenu(root));
    }
}

checkMenus();
