-- Find the 'Program' menu item
DO $$
DECLARE
    program_id UUID;
BEGIN
    -- Get the ID of the 'Program' menu
    SELECT id INTO program_id FROM navigation_menus WHERE title = 'Program' LIMIT 1;

    IF program_id IS NOT NULL THEN
        -- Update the 'Program' menu to point to /program
        UPDATE navigation_menus
        SET href = '/program'
        WHERE id = program_id;

        -- Delete all children of the 'Program' menu
        DELETE FROM navigation_menus
        WHERE parent_id = program_id;
    END IF;
END $$;
