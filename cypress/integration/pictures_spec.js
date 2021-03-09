/// <reference types="Cypress" />

import { skipOn } from "@cypress/skip-test";

describe("Stubbed tests", () => {
  it("logs and searches for 444", () =>
    cy
      .fixture("pictures_userXXX")
      .as("pictures_userXXX")
      .then((userXXX) => {
        cy.fixture("pictures_search444")
          .as("pictures_search444")
          .then((search444) => {
            // given
            cy.intercept("GET", "app/json/session", userXXX).as("logging in");
            cy.intercept(
              "GET",
              /app\/album\/-?\d+\/page\/\d+\?toSearch=[\d\w]+&knownPageSize=\d+$/,
              search444
            ).as("searching for 444");

            // cy.pause();
            // when
            cy.visit("https://adrhc.go.ro/pictures");
            // then
            cy.url().should("include", "/#/albums");

            // given
            cy.get("#search").type("444");
            // when
            cy.contains("Search").click();

            // then
            cy.get("i.fas.fa-sign-out-alt"); // log out button
            // cy.get(".user-info").contains(`[${userName}]`); // logged user name
            cy.get("ul.image-set"); // images set
            cy.get("ul.pagination").within(() => {
              cy.get("li:nth-of-type(3) > a.page-link").contains("1");
              cy.get("a.page-link").should("have.length", "5"); // counts all navigation buttons
            });
          });
      }));

  /* it("logs and searches for 444", () => {
      cy.intercept("GET", "app/json/session", {
        fixture: "pictures_userXXX",
      }).as("logging in");
      cy.intercept(
        "GET",
        /app\/album\/-?\d+\/page\/\d+\?toSearch=[\d\w]+&knownPageSize=\d+$/,
        {
          fixture: "pictures_search444.json",
        }
      ).as("searching for 444");
      // when
      cy.visit("https://adrhc.go.ro/pictures");
      // then
      cy.url().should("include", "/#/albums");

      // given
      cy.get("#search").type("444");
      // when
      cy.contains("Search").click();

      // then
      cy.get("i.fas.fa-sign-out-alt"); // log out button
      // cy.get(".user-info").contains(`[${userName}]`); // logged user name
      cy.get("ul.image-set"); // images set
      cy.get("ul.pagination").within(() => {
        cy.get("li:nth-of-type(3) > a.page-link").contains("1");
        cy.get("a.page-link").should("have.length", "5"); // counts all navigation buttons
      }); 
    }); */
});

skipOn(false, () => {
  describe("Not stubbed tests", () => {
    it("searches for 444 without logging in advance", () => {
      // given & when
      cy.visit("https://adrhc.go.ro/pictures");
      // then
      cy.url().should("include", "/#/albums");

      // given
      cy.get("#search").type("444");
      // when
      cy.contains("Search").click();
      // then
      cy.url().should("include", "/#/login");

      // given
      cy.get("[placeholder='User name']").type("wrong user name");
      cy.get("[placeholder='Password']").type("wrong password");
      // when
      cy.contains("Submit").click();
      // then
      cy.url().should("include", "/#/login");
      cy.contains("Bad credentials");
    });

    skipOn(true, () => {
      it("logs and searches for 444", () => {
        const userName = "xxx";
        const password = "xxx";

        // given: programmatically log us in without needing the UI
        cy.request(
          "POST",
          `https://adrhc.go.ro/photos/app/login?userName=${userName}&password=${password}`
        );
        // when
        cy.visit("https://adrhc.go.ro/pictures");
        // then
        cy.url().should("include", "/#/albums");

        // given
        cy.get("#search").type("444");
        // when
        cy.contains("Search").click();

        // then
        cy.get("i.fas.fa-sign-out-alt"); // log out button
        cy.get(".user-info").contains(`[${userName}]`); // logged user name
        cy.get("ul.image-set"); // images set
        cy.get("ul.pagination").within(() => {
          cy.get("li:nth-of-type(3) > a.page-link").contains("1");
          cy.get("a.page-link").should("have.length", "5"); // counts all navigation buttons
        });
      });
    });
  });
});
