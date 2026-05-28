import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceRenewal } from './licence-renewal';

describe('LicenceRenewal', () => {
  let component: LicenceRenewal;
  let fixture: ComponentFixture<LicenceRenewal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenceRenewal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceRenewal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
