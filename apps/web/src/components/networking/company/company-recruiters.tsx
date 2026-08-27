import { Button } from "@doresume/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@doresume/ui/components/item";
import { LinkedIn } from "@doresume/ui/socials/linkedin";
import Link from "next/link";

import type { CompanyRecruiter } from "../data/companies";

const CompanyRecruiters = ({
  recruiters,
}: {
  recruiters: CompanyRecruiter[];
}) => (
  <section className="flex flex-col gap-3">
    <h3>Recruiters</h3>
    <ItemGroup>
      {recruiters.map((recruiter) => (
        <Item key={recruiter.id} variant="outline">
          <ItemContent>
            <ItemTitle>{recruiter.name}</ItemTitle>
            <ItemDescription>{recruiter.title}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              nativeButton={false}
              render={
                <Link
                  aria-label={`Open ${recruiter.name} on LinkedIn`}
                  href={recruiter.linkedin}
                  rel="noopener"
                  target="_blank"
                />
              }
              size="sm"
              variant="outline"
            >
              <LinkedIn data-icon="inline-start" />
              LinkedIn
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  </section>
);

export { CompanyRecruiters };
