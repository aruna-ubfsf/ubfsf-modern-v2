import {
  getStaffPage,
  getBoardDirectorsPage,
  getBoardAdvisoryPage,
} from "../src/lib/wordpress/staff";

async function main() {
  const [staff, directors, advisory] = await Promise.all([
    getStaffPage(),
    getBoardDirectorsPage(),
    getBoardAdvisoryPage(),
  ]);

  console.log("\n=== STAFF ===");
  console.log(`Found ${staff?.staff.length ?? 0} members`);
  staff?.staff.forEach((m) => {
    console.log(
      `- ${m.name} | ${m.role} | ${m.sectionTitle} | img: ${m.img ? "yes" : "NO"}`
    );
  });

  console.log("\n=== BOARD OF DIRECTORS ===");
  console.log(`Found ${directors?.staff.length ?? 0} members`);
  directors?.staff.forEach((m) => {
    console.log(`- ${m.name} | ${m.role} | img: ${m.img ? "yes" : "NO"}`);
  });

  console.log("\n=== BOARD OF ADVISORY ===");
  console.log(`Found ${advisory?.staff.length ?? 0} members`);
  advisory?.staff.forEach((m) => {
    console.log(`- ${m.name} | ${m.role} | img: ${m.img ? "yes" : "NO"}`);
  });
}

main();
