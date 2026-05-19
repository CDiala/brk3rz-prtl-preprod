import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyUser } from './identify-user';

describe('IdentifyUser', () => {
  let component: IdentifyUser;
  let fixture: ComponentFixture<IdentifyUser>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdentifyUser],
    });
    fixture = TestBed.createComponent(IdentifyUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
