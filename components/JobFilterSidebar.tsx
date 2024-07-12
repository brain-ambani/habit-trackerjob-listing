import { JobTypes } from "@/lib/job-types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { Button } from "./ui/button";

async function filterJobs(formData: FormData) {
  "use server";

  console.log(formData.get("q") as string);
}

export default async function JobFilterSidebar() {
  const distinctLocations = (await prisma?.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean)
    )) as string[];

  return (
    <aside
      className="md:w-[260px] p-4 sticky top-0 h-fit bg-background
  border rounded-lg"
    >
      <form action={filterJobs}>
        <div className="space-y-4">
          {/*Search bar for job titles, company, locations and type  */}
          <div className="flex flex-col ,gap-2">
            <Label htmlFor="q">Search</Label>
            <Input id="q" name="q" placeholder="Title, company, etc" />
          </div>

          {/* Job types */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue="">
              <option value="">All locations</option>
              {JobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          {/* locations */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" defaultValue="">
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              type="checkbox"
              name="remote"
              className="sclae-125 accent-black"
            />
            <Label htmlFor="remote">Remote</Label>
          </div>
          <Button type="submit" className="w-full">
            Filter jobs
          </Button>
        </div>
      </form>
    </aside>
  );
}
