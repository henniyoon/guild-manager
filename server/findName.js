
// SELECT name FROM sub_member WHERE main_name IN (SELECT name FROM noblelimit);

// SELECT name FROM noblelimit WHERE name NOT IN (SELECT main_name FROM sub_member WHERE main_name IS NOT NULL);
