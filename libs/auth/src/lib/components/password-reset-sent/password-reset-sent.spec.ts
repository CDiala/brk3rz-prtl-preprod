import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordResetSent } from './password-reset-sent';

describe('PasswordResetSent', () => {
  let component: PasswordResetSent;
  let fixture: ComponentFixture<PasswordResetSent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetSent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetSent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
