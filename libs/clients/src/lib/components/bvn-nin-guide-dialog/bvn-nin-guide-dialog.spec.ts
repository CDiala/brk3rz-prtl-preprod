import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BvnNinGuideDialog } from './bvn-nin-guide-dialog';

describe('BvnNinGuideDialog', () => {
  let component: BvnNinGuideDialog;
  let fixture: ComponentFixture<BvnNinGuideDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BvnNinGuideDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BvnNinGuideDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
